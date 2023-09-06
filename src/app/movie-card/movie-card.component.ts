import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }


  /**
   * Get all movies to display
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /** 
   * Get user info and set favorites
   * */
 getFavorites(): void {
  this.fetchApiData.getOneUser().subscribe(
    (resp: any) => {
      if (resp.user && resp.user.FavoriteMovies) {
        this.favorites = resp.user.FavoriteMovies;
      } else {
        this.favorites = []; // Set an empty array if data is not available
      }
    },
    (error: any) => {
      console.error('Error fetching user data:', error);
      this.favorites = []; // Set an empty array on error as well
    }
  );
}

   /**
    * Check if a movie is a user's favorite already
    * */
  isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  /**
   * Add a movie to a user's favorites 
   * Or remove on click if it is already a favorite
   * */
addToFavorites(id: string): void {
  if (this.isFavoriteMovie(id)) {
    // Movie is already a favorite, so remove it
    this.removeFromFavorites(id);
  } else {
    // Movie is not a favorite, so add it
    this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.getFavorites();
    });
  }
}

  /** 
   * Removes a movie from a user's favorites
   * */
removeFromFavorites(id: string): void {
  console.log(id);
  this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
    this.snackBar.open('Movie removed from favorites', 'OK', {
      duration: 2000,
    });

    const username = localStorage.getItem('Username');
    if (username !== null) {
      // Fetch the updated favorite movies data
      this.fetchApiData.getFavoriteMovies(username).subscribe((favorites: any) => {
        this.favorites = favorites;
      });
    }
  });
}



  /** 
   *  Open genre information from GenreComponent 
   * @param genre name
   * @paramgenre description
   * */
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '400px',
    });
  }

  /** 
   * Open director information from DirectorComponent
   * @param director name
   * @param director bio
   * @param director birthday
   * */
  openDirector(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birthday,
      },
      width: '400px',
    });
  }

  /** Open movie description from MovieInfoComponent
   * @param movie title
   * @param movie description aka summary
   * */
  openSummary(title: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '400px',
    });
  }
}