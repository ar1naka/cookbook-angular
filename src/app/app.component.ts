import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyComponentComponent } from "./my-component/my-component.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MyComponentComponent
  ],
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'my-app';
}
