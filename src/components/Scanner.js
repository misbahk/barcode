import React, { Component } from 'react';
import Quagga from 'quagga';
import Brcode from '../04.jpg'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
var result;
export default class Scanner extends Component {
state = {
src: null,
crop: '',
field:false,
imagearea:false
}



componentDidMount(){
localStorage. clear();
}

onSelectFile = e => {
if (e.target.files && e.target.files.length > 0) {
const reader = new FileReader();
reader.addEventListener('load', () =>
this.setState({ src: reader.result })
);
reader.readAsDataURL(e.target.files[0]);
}
this.setState({
imagearea:true
})
};
onImageLoaded = image => {
this.imageRef = image;
};

onCropComplete = crop => {
this.makeClientCrop(crop);
};

onCropChange = (crop, percentCrop) => {
// You could also use percentCrop:
// this.setState({ crop: percentCrop });
this.setState({ crop });
};

async makeClientCrop(crop) {
if (this.imageRef && crop.width && crop.height) {
const croppedImageUrl = await this.getCroppedImg(
this.imageRef,
crop,
'newFile.jpeg'
);
this.setState({ croppedImageUrl });
}

}
someFunction = ()=>{
let local = localStorage.getItem("CODE")
result = local
this.setState({
field:true
})
}
getCroppedImg(image, crop, fileName) {
Quagga.decodeSingle({
src: this.state.src,
numOfWorkers: 1,
inputStream: {
size: 800
},
decoder: {
readers: ["code_128_reader", "code_39_reader", "code_39_vin_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader", "codabar_reader"]
},
}, function(result) {
if(result.codeResult) {
console.log(result.codeResult.code)
setTimeout(() => {
localStorage.setItem("CODE",result.codeResult.code)
},3000);
} else {
localStorage.setItem("CODE","NOT DETECTED")
}
});
setTimeout(() => {
this.someFunction()
},5000);
const canvas = document.createElement('canvas');
const scaleX = image.naturalWidth / image.width;
const scaleY = image.naturalHeight / image.height;
canvas.width = crop.width;
canvas.height = crop.height;
const ctx = canvas.getContext('2d');

ctx.drawImage(
image,
crop.x * scaleX,
crop.y * scaleY,
crop.width * scaleX,
crop.height * scaleY,
0,
0,
crop.width,
crop.height
);
return new Promise((resolve, reject) => {
canvas.toBlob(blob => {
if (!blob) {
//reject(new Error('Canvas is empty'));
console.error('Canvas is empty');
return;
}
blob.name = fileName;
window.URL.revokeObjectURL(this.fileUrl);
this.fileUrl = window.URL.createObjectURL(blob);
resolve(this.fileUrl);
}, 'image/jpeg');
});
}








render() {
const { crop, croppedImageUrl, src } = this.state;
return (
<>
<div className="App">
<div>
{this.state.imagearea?
<p>PLEASE SELECT THE AREA OF BARCODE IMAGE AFTER IMAGE UPLOAD</p>
:
null}
<input type="file" accept="image/*" onChange={this.onSelectFile} />
</div>
{src && (
<ReactCrop
src={src}
crop={crop}
ruleOfThirds
onImageLoaded={this.onImageLoaded}
onComplete={this.onCropComplete}
onChange={this.onCropChange}
/>
)}
<br/>
<br/>
<br/>
<br/>
{croppedImageUrl && (
<img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
)}

</div>
{this.state.field?
<p>BARCODE OUTPUT:{result}</p>

:
null
}
{/* <img id="target" src={this.state.image}/>
<input type="file" name="image" onChange={this.handleChange}/> */}
</>
)
}
}