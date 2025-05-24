import { Component } from '@angular/core';
import { EmailDesignerComponent } from './email-designer/email-designer.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SafeUrlPipe } from './email-designer/safe-url.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmailDesignerComponent,  FormsModule, SafeUrlPipe, DragDropModule, QuillModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'email-designer-app';
}
