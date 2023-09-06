import { Component, OnInit, Input } from '@angular/core';

// This import to closes the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls created in the service file
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Name: '', Password: '', Email: '', Birthday: '' };

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
  // Logic for a successful user registration goes here! (To be implemented)
    console.log(response)
      this.dialogRef.close(); // This will close the modal on success!
     this.snackBar.open('User registered successfully!', 'OK', {
        duration: 2000
     });
         // log user in and navigate to movies
      this.fetchApiData.userLogin(this.userData).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.router.navigate(['movies']);
      })
      
    }, (response) => {
      console.log(response)
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
}
  
  

  }