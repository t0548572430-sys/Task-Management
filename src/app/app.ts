
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <--- ודאי שזה קיים

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <--- ודאי שזה קיים ברשימה
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'client';
}