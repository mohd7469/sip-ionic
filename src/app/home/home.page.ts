import {Component, OnInit} from '@angular/core';
import {Platform, AlertController} from '@ionic/angular';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{

    /*
    permissions = [
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.REQUEST_MICROPHONE,
    ];
    */
    microphonePermission = null;

    constructor(
        public platform: Platform,
        private androidPermissions: AndroidPermissions,
        private alertController: AlertController,
        private openNativeSettings: OpenNativeSettings
    ) {
        this.microphonePermission = this.androidPermissions.PERMISSION.REQUEST_MICROPHONE;
    }

    ngOnInit(): void {
        this.checkPermission();
    }

    checkPermission() {
        const onsuccess = (result) => {
            if(!result.hasPermission) {
                console.log('Has still not authorized yet : Check Permission Error ');
                return this.requestForPermissions();
            }
            console.log('Has permission ', result.hasPermission);
        };
        const onerror = (err) => {
            console.log('Check Permission Error ');
            this.requestForPermissions();
        };

        this.platform.ready().then(() => {
            console.log('Checking Android Permissions.. ');
            this.androidPermissions.checkPermission(this.microphonePermission).then(onsuccess, onerror);
        });
    }

    requestForPermissions() {
        console.log('Requesting Permission..');

        const onsuccess = (result) => {
            if(!result.hasPermission) {
                console.log('Has still not authorized yet : Request Permission Error ');
                // return this.openSettings();;
            }
            console.log('Permissions Granted ', result.hasPermission);
        };
        const onerror = (err) => {
            console.log('Request Permission Error ');
            // this.openSettings();
        };

        this.androidPermissions.requestPermission(this.microphonePermission).then(onsuccess, onerror);
    }

    openSettings() {
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
    }

}
