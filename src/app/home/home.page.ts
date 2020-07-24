import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

import {AlertController} from 'ionic-angular';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{

    permissions = [
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.REQUEST_MICROPHONE,
    ];

    constructor(
        public platform: Platform,
        private androidPermissions: AndroidPermissions,
        private alertCtrl: AlertController,
        private openNativeSettings: OpenNativeSettings
    ) {
        this.platform.ready().then(() => {
            console.log('Android Permissions ', this.androidPermissions);
            this.androidPermissions.checkPermission(this.permissions[0]).then(
                result => console.log('Has permission ', result.hasPermission),
                err => this.openNativeSettings();
            );
        });
    }

    ngOnInit(): void {
        this.requestForPermissions();
    }

    openNativeSettings() {
        this.alertController.create({
            header: 'Could not start app.',
            subHeader: 'Please enable microphone permissions in the system app settings.',
            buttons: [
                'Cancel',
                {
                    text: 'Open App Settings',
                    handler: () => this.openNativeSettings.open('application_details')
                }
            ]
        })
            .then(alert => alert.present());

        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO);
    }

    requestForPermissions() {
        console.log('Requesting Permission..');
        this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.RECORD_AUDIO,
            this.androidPermissions.PERMISSION.REQUEST_MICROPHONE,
        ])
            .then(
                result => console.log('Permissions Granted ', result.hasPermission),
                err => this.requestForPermissions()
            );
    }

}
