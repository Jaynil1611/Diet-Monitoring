import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicErrorHandler, IonicModule, IonicApp } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { RouterModule } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeStorage } from '@ionic-native/native-storage';
import { NgProgress, NgProgressModule } from '@ngx-progressbar/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home';
import { firebaseConfig } from './credentials';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth  } from 'angularfire2/auth';
import { LoginComponent } from './login/login';
import { FireauthserviceProvider } from '../providers/fireauthservice/fireauthservice';
import { HttpClientModule } from '@angular/common/http'; 
import { RegisterComponent } from './register/register';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path : 'home', component : HomeComponent},
      {path : 'login' , component : LoginComponent},
      {path : 'register', component : RegisterComponent},
      {path :  "", redirectTo:'/login', pathMatch:'full'}
      ]),
    IonicModule.forRoot(AppComponent),
    NgProgressModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    TextToSpeech,
    NativeStorage,
    NgProgress,
    AngularFireAuth,
    FireauthserviceProvider
  ]
})
export class AppModule {}
