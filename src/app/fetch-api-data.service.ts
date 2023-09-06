import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

/**
 * The url for the api that provides data for the app
 */
const apiUrl = 'https://myflix-pkm.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) { }
  
  /** 
   * User registration api call
   * @param userDetails
   * @returns an observable with the created user 
   */
public userRegistration(userDetails: any): Observable<any> {
  console.log(userDetails);
  return this.http.post(apiUrl + 'users', userDetails).pipe(
    tap((response: any) => {
      localStorage.setItem('user', JSON.stringify(response.user)); // Assuming the response contains the user object
      localStorage.setItem('token', response.token); // Assuming the response contains the token
    }),
    catchError(this.handleError)
  );
}


  /** 
   * User login api call
   * Checks if the username and password are correct and provides a token
   * @param userDetails with users username and password
   * @returns users info and token
   */

public userLogin(userDetails: any): Observable<any> {
  console.log(userDetails);
  return this.http.post(apiUrl + 'login', userDetails).pipe(
    tap((response: any) => {
      localStorage.setItem('user', JSON.stringify(response.user)); // Assuming the response contains the user object
      localStorage.setItem('token', response.token); // Assuming the response contains the token
    }),
    catchError(this.handleError)
  );
}

  /**
   * Get all movies from api
   * @returns array of all movies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets info for one movie from the api
   * @param Title of movie
   * @returns movie information
   */
  getOneMovie(Title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + Title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets info for one director from the api
   * @param directorName 
   * @returns director information
   */

  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/Director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets information from one genre from api
   * @param genreName 
   * @returns genre info
   */

  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/Genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get the info for one user from the api
   * @returns user info
   */
   getOneUser(): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get users favorite movies list from api
   * @param Username 
   * @returns users favorite movies list
   */
  getFavoriteMovies(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * Add a movie to users favorite movies list
   * @param movieID 
   * @returns updated favorite movies list
   */
addFavoriteMovie(movieID: string): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  console.log('Before:', user.FavoriteMovies);
  
  user.FavoriteMovies.push(movieID); // Update the FavoriteMovies array

  console.log('After:', user.FavoriteMovies);
  
  localStorage.setItem('user', JSON.stringify(user)); // Update the user object in localStorage

  return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieID, {}, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

/*   isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }
 */
  
  /**
   * Updates/edits users info
   * @param updatedUser new information for user
   * @returns Updated user info
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Delete user and their information from the database by username
   * @returns user goes back to welcome screen
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove a movie from users favorite movies list
   * @param movieID 
   * @returns updated favorite movies list
   */
deleteFavoriteMovie(movieID: string): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const index = user.FavoriteMovies.indexOf(movieID);
  if (index > -1) {
    user.FavoriteMovies.splice(index, 1); // Remove the movie ID from the array
  }

  localStorage.setItem('user', JSON.stringify(user)); // Update the user object in localStorage

  return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieID, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }),
    responseType: "text"
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}


   
   private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.log(error);
      console.log(error.error);
      console.error('Some error occurred:', error.error.message);
    } else {
      console.log(error);
      console.log(error.error);
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() =>
      new Error('Something bad happened; please try again later.'));
  }
}