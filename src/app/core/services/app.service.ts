import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import build from 'src/build';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private matSnackbar: MatSnackBar) {}

  /**
   * Opens a material snackbar with a message and predefined action (OK)
   *
   * @public
   * @param string message
   * @returns void
   */
  public openSnackBar(message: string): void {
    this.matSnackbar.open(message, 'OK', {
      duration: 3500,
    });
  }

  /**
   * Show the signature of the app, for copyrights and get the hash of last version
   *
   * @public
   * @returns void
   */
  public showSignature(): void {
    const currentYear = new Date().getFullYear();

    console.log(
      '%cv' +
        build.version +
        '%cDernière version : ' +
        moment(new Date(build.timestamp)).locale('fr').fromNow() +
        '%c\n%cHash de la dernière build : ' +
        build.git.fullHash +
        '%c\n' +
        ('%c\n© Tech Fever ' +
          currentYear +
          ' - Tous droits réservés sur le code-source, en vertu des articles L121-1 à L121-9 du Code de la propriété intellectuelle.'),
      'display: inline-block; margin-top: 10px; width:100%; font-family: Trebuchet MS; text-align: center; background-color: #4caf50; color: #fff; padding: 10px; border-radius: 10px',
      'display: inline-block; margin-top: 10px; margin-left: 5px; width:100%; font-family: Trebuchet MS; text-align: center; background-color: #ddd; color: #000; padding: 10px; border-radius: 10px',
      '',
      'display: inline-block; margin-top: 10px; width:100%; font-family: Trebuchet MS; text-align: center; background-color: #ddd; color: #000; padding: 10px; border-radius: 10px',
      '',
      'font-family: Trebuchet MS; margin-bottom: 10px'
    );

    console.log(
      '%c🚀 Propulsé par https://techfever.dev/',
      'font-family: Trebuchet MS; font-size: 15px; font-weight: bold; padding: 10px'
    );
  }
}
