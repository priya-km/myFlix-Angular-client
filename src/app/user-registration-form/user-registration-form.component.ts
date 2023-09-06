import { Component, OnInit, Input } from '@angular/core';

// This import to closes the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls created in the service file
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications to the user, such as a success message after user registration
import { MatSnackBar } from '@angular/material/snack-bar';

// This import is used to route the user to another page 
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

/** 
 * This is the function responsible for sending the form inputs to the backend
 * */
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
  // Logic for a successful user registration
    console.log(response)
      this.dialogRef.close(); // This will close the modal on success!
     this.snackBar.open('User registered successfully!', 'OK', {
        duration: 2000
     });
    }, (response) => {
      console.log(response)
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
}
  
  

  }