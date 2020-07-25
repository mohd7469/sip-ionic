import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'
// import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})

// providers: [AndroidPermissions, OpenNativeSettings, UniqueDeviceID],

export class HomePageModule {}
