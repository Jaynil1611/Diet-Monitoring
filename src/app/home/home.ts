import { Component } from '@angular/core';
import { ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import * as Tessaract from 'tesseract.js';
import { Camera,  PictureSourceType } from '@ionic-native/camera';
import { NgProgress } from '@ngx-progressbar/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeStorage } from '@ionic-native/native-storage';
import { DietserviceProvider } from '../../providers/dietservice/dietservice';

@Component({
  selector: 'app-home',
  templateUrl: '/home.html',
  styleUrls: ['/home.css']
})
// export class HomePage {

//   constructor(public navCtrl: NavController) {

//   }

// }
export class HomeComponent {
  selectedImage:string;
  imageText :any;
  ncount:number;
  confirmImage = false;
  res: any;

  constructor(public toss:ToastController,
    private ns:NativeStorage,
    private tts:TextToSpeech,
    private loading:LoadingController,
    private actionsh:ActionSheetController,private camera:Camera,public progress:NgProgress,
    public dietserve : DietserviceProvider) {
      this.ns.getItem('notecount').then(result=>{
        this.ncount = result.count;
      })
      .catch(_=>{
        this.ns.setItem('notecount',{
          count:0,
        })
      })
  }
  incr(){
    this.confirmImage = true;
    
  }
  refresh(){
    this.selectedImage = "";
  }

  chooseImage(){
    let actionSheet = this.actionsh.create({
      buttons: [
        {
          text: 'Use Library',
          role: 'library',
          icon: 'folder-open',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Capture Image',
          role: 'camera',
          icon: 'camera',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
 
    actionSheet.present();
  }
 
  getPicture(source:PictureSourceType){
    this.camera.getPicture({
      quality:100,
      destinationType:this.camera.DestinationType.DATA_URL,
      allowEdit:true,
      correctOrientation:true,
      sourceType:source,
      saveToPhotoAlbum:false,
    }).then(imageData=>{
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      
    })
    .catch(reason=>{
      alert(reason);
    })
  }

  // speak(){
  //   this.tts.speak(this.imageText)
  //   .then(response=>{

  //   })
  //   .catch(error=>{
  //     alert(error)
  //   })
  // }
  
  recog(){
    let lc = this.loading.create({
      content:'Recognizing...',
      spinner:'Lines',
    })
    lc.present();
    Tessaract.recognize(this.selectedImage)
    .progress(result=>{
      if(result.status=='recognizing text'){
        this.progress.set(result.progress);
      }
    })
    .catch(e=>{
      alert(e)
    })
    .then(result=>{
      this.imageText = result.lines;
      console.log(result);
      console.log(this.imageText);
      // console.log(this.imageText.text);
    })
    .finally(ress=>{
      this.progress.complete();
      lc.dismiss();
    })
  }
  addDietSamples()
  {
    this.dietserve.addDiet(this.imageText);
  }
}