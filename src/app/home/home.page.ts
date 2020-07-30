import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { Web } from 'sip.js';
import { getAudio, getButton, getButtons, getInput, getSpan, getDiv } from './demo-utils';
// @ts-ignore
const { SimpleUser, SimpleUserDelegate, SimpleUserOptions } = Web;

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {
    isCalling = false;
    isConnected = false;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
    }

    ngAfterViewInit() {
        const statusDiv = getDiv('status');
        // const serverSpan = getSpan('server');
        // const targetSpan = getSpan('target');
        // const connectButton = getButton('connect');
        const callButton = getButton('call');
        const hangupButton = getButton('hangup');
        // const disconnectButton = getButton('disconnect');
        const audioElement = getAudio('remoteAudio');
        // const keypad = getButtons('keypad');
        // const dtmfSpan = getSpan('dtmf');
        const holdCheckbox = getInput('hold');
        const muteCheckbox = getInput('mute');

        const user = {
            'User'      : 'crescas',                    // User Name
            'Pass'      : 'ab*Nb67f',                   // Password
            'Realm'     : 'sip.crescas.net',            // Auth Realm
            'Display'   : 'Crescas',                    // Display Name
            'WSServer'  : 'wss://sip.crescas.net:4433'  // WebSocket URL
        };

        const webSocketServer = user.WSServer;
        // serverSpan.innerHTML = webSocketServer;

        const target = 'sip:' + user.User + '@' + user.Realm;
        // targetSpan.innerHTML = target;

        statusDiv.innerHTML = 'Connecting..';
        this.isConnected = false;
        this.cdr.detectChanges();

        // audioElement.hidden = true;

        const displayName = user.Display;

        // @ts-ignore
        const simpleUserDelegate: SimpleUserDelegate = {
            onCallCreated: (): void => {
                console.log(`[${displayName}] Call created`);
                callButton.disabled = true;
                this.isCalling = true;
                this.cdr.detectChanges();
                hangupButton.disabled = false;
                // keypadDisabled(true);
                holdCheckboxDisabled(true);
                muteCheckboxDisabled(true);
            },
            onCallAnswered: (): void => {
                console.log(`[${displayName}] Call answered`);
                // keypadDisabled(false);
                holdCheckboxDisabled(false);
                muteCheckboxDisabled(false);
            },
            onCallHangup: (): void => {
                console.log(`[${displayName}] Call hangup`);
                callButton.disabled = false;
                this.isCalling = false;
                this.cdr.detectChanges();
                hangupButton.disabled = true;
                // keypadDisabled(true);
                holdCheckboxDisabled(true);
                muteCheckboxDisabled(true);
            },
            onCallHold: (held: boolean): void => {
                console.log(`[${displayName}] Call hold ${held}`);
                holdCheckbox.checked = held;
            }
        };

        // @ts-ignore
        const simpleUserOptions: SimpleUserOptions = {
            delegate: simpleUserDelegate,
            media: {
                remote: {
                    audio: audioElement
                }
            },
            userAgentOptions: {
                displayName,
                authorizationUsername: user.User,
                authorizationPassword: user.Pass
            }
        };

        const simpleUser = new SimpleUser(webSocketServer, simpleUserOptions);

        // connectButton.addEventListener('click', () => {
        // connectButton.disabled = true;
        // disconnectButton.disabled = true;
        callButton.disabled = true;
        this.isCalling = true;
        this.cdr.detectChanges();
        hangupButton.disabled = true;
        simpleUser
            .connect()
            .then(() => {
                // connectButton.disabled = true;
                // disconnectButton.disabled = false;
                callButton.disabled = false;
                this.isCalling = false;
                hangupButton.disabled = true;
                statusDiv.innerHTML = 'Connected';
                this.isConnected = true;
                this.cdr.detectChanges();
            })
            .catch((error: Error) => {
                // connectButton.disabled = false;
                console.error(`[${simpleUser.id}] failed to connect`);
                console.error(error);
                alert('Failed to connect.\n' + error);
            });
        // });

        callButton.addEventListener('click', () => {
            callButton.disabled = true;
            this.isCalling = true;
            this.cdr.detectChanges();
            hangupButton.disabled = true;
            simpleUser.call(target).catch((error: Error) => {
                console.error(`[${simpleUser.id}] failed to place call`);
                console.error(error);
                alert('Failed to place call.\n' + error);
            });
        });

        hangupButton.addEventListener('click', () => {
            callButton.disabled = true;
            this.isCalling = true;
            this.cdr.detectChanges();
            hangupButton.disabled = true;
            simpleUser.hangup().catch((error: Error) => {
                console.error(`[${simpleUser.id}] failed to hangup call`);
                console.error(error);
                alert('Failed to hangup call.\n' + error);
            });
        });

        // disconnectButton.addEventListener('click', () => {
        //   // connectButton.disabled = true;
        //   // disconnectButton.disabled = true;
        //   callButton.disabled = true;
        //   hangupButton.disabled = true;
        //   simpleUser
        //     .disconnect()
        //     .then(() => {
        //       // connectButton.disabled = false;
        //       // disconnectButton.disabled = true;
        //       callButton.disabled = true;
        //       hangupButton.disabled = true;
        //     })
        //     .catch((error: Error) => {
        //       console.error(`[${simpleUser.id}] failed to disconnect`);
        //       console.error(error);
        //       alert('Failed to disconnect.\n' + error);
        //     });
        // });

        // keypad.forEach((button) => {
        //   button.addEventListener('click', () => {
        //     const tone = button.textContent;
        //     if (tone) {
        //       simpleUser.sendDTMF(tone).then(() => {
        //         dtmfSpan.innerHTML += tone;
        //       });
        //     }
        //   });
        // });

        // const keypadDisabled = (disabled: boolean): void => {
        //   keypad.forEach((button) => (button.disabled = disabled));
        //   dtmfSpan.innerHTML = '';
        // };

        holdCheckbox.addEventListener('change', () => {
            if (holdCheckbox.checked) {
                // Checkbox is checked..
                simpleUser.hold().catch((error: Error) => {
                    holdCheckbox.checked = false;
                    console.error(`[${simpleUser.id}] failed to hold call`);
                    console.error(error);
                    alert('Failed to hold call.\n' + error);
                });
            } else {
                // Checkbox is not checked..
                simpleUser.unhold().catch((error: Error) => {
                    holdCheckbox.checked = true;
                    console.error(`[${simpleUser.id}] failed to unhold call`);
                    console.error(error);
                    alert('Failed to unhold call.\n' + error);
                });
            }
        });

        const holdCheckboxDisabled = (disabled: boolean): void => {
            holdCheckbox.checked = false;
            holdCheckbox.disabled = disabled;
        };

        muteCheckbox.addEventListener('change', () => {
            if (muteCheckbox.checked) {
                // Checkbox is checked..
                simpleUser.mute();
                if (simpleUser.isMuted() === false) {
                    muteCheckbox.checked = false;
                    console.error(`[${simpleUser.id}] failed to mute call`);
                    alert('Failed to mute call.\n');
                }
            } else {
                // Checkbox is not checked..
                simpleUser.unmute();
                if (simpleUser.isMuted() === true) {
                    muteCheckbox.checked = true;
                    console.error(`[${simpleUser.id}] failed to unmute call`);
                    alert('Failed to unmute call.\n');
                }
            }
        });

        const muteCheckboxDisabled = (disabled: boolean): void => {
            muteCheckbox.checked = false;
            muteCheckbox.disabled = disabled;
        };

        // connectButton.disabled = false;

    }

}
