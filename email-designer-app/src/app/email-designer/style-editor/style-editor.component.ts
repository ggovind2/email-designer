import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Block } from '../models/block.interface';
import { BlockStyle } from '../models/block-style.interface';

@Component({
  selector: 'app-style-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="offcanvas offcanvas-end" [class.show]="isVisible" tabindex="-1" id="styleEditor">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Style Editor</h5>
        <button type="button" class="btn-close" (click)="close()" aria-label="Close"></button>
      </div>
      <ng-container *ngIf="selectedBlock">
        <div class="offcanvas-body">
          <div class="mb-3">
            <label class="form-label">Padding</label>
            <div class="input-group">
              <input type="number" class="form-control" [ngModel]="selectedBlock.styles?.padding" 
                     (ngModelChange)="styleChanged('padding', $event)">
              <span class="input-group-text">px</span>
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Background Color</label>
            <input type="color" class="form-control form-control-color" 
                   [ngModel]="selectedBlock.styles?.backgroundColor"
                   (ngModelChange)="styleChanged('backgroundColor', $event)">
          </div>

          <div class="mb-3">
            <label class="form-label">Width</label>
            <div class="input-group">
              <input type="number" class="form-control" [ngModel]="selectedBlock.styles?.width" 
                     (ngModelChange)="styleChanged('width', $event)">
              <span class="input-group-text">%</span>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Text Align</label>
            <select class="form-select" [ngModel]="selectedBlock.styles?.textAlign"
                    (ngModelChange)="styleChanged('textAlign', $event)">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Border Type</label>
            <select class="form-select" [ngModel]="selectedBlock.styles?.borderType"
                    (ngModelChange)="onBorderTypeChange($event)">
              <option value="transparent">Transparent</option>
              <option value="light">Light</option>
              <option value="solid">Solid</option>
            </select>
          </div>

          <ng-container *ngIf="selectedBlock.styles?.borderType === 'light' || selectedBlock.styles?.borderType === 'solid'">
            <div class="mb-3">
              <label class="form-label">Border Width</label>
              <div class="input-group">
                <input type="number" class="form-control" [ngModel]="selectedBlock.styles?.borderWidth" 
                       (ngModelChange)="styleChanged('borderWidth', $event)">
                <span class="input-group-text">px</span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Border Color</label>
              <input type="color" class="form-control form-control-color" 
                     [ngModel]="selectedBlock.styles?.borderColor"
                     (ngModelChange)="styleChanged('borderColor', $event)">
            </div>

            <div class="mb-3">
              <label class="form-label">Border Radius</label>
              <div class="input-group">
                <input type="number" class="form-control" [ngModel]="selectedBlock.styles?.borderRadius" 
                       (ngModelChange)="styleChanged('borderRadius', $event)">
                <span class="input-group-text">px</span>
              </div>
            </div>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .offcanvas {
      width: 400px;
    }
    .form-control-color {
      width: 100%;
      height: 38px;
    }
    .offcanvas-backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class StyleEditorComponent {
  @Input() isVisible = false;
  @Input() selectedBlock: Block | null = null;
  @Output() styleUpdate = new EventEmitter<{property: keyof BlockStyle; value: any}>();
  @Output() closeEditor = new EventEmitter<void>();

  onBorderTypeChange(type: string) {
    if (!this.selectedBlock || !this.selectedBlock.styles) {
      return;
    }

    this.styleChanged('borderType', type);
    
    if (type === 'light' || type === 'solid') {
      // Set default values for border properties
      if (!this.selectedBlock.styles.borderWidth) {
        this.styleChanged('borderWidth', 1);
      }
      if (!this.selectedBlock.styles.borderColor) {
        this.styleChanged('borderColor', type === 'light' ? '#dee2e6' : '#000000');
      }
      if (!this.selectedBlock.styles.borderRadius) {
        this.styleChanged('borderRadius', 0);
      }
    }
  }

  styleChanged(property: keyof BlockStyle, value: any) {
    if (this.selectedBlock) {
      this.styleUpdate.emit({ property, value });
    }
  }

  close() {
    this.closeEditor.emit();
  }
}
