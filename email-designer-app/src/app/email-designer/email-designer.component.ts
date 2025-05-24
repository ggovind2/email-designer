import { Component, SecurityContext } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { SafeUrlPipe } from './safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';
import { StyleEditorComponent } from './style-editor/style-editor.component';

@Component({
  selector: 'app-email-designer',
  standalone: true,
  imports: [
    CommonModule, 
    SafeUrlPipe, 
    FormsModule, 
    CdkDropList, 
    CdkDrag, 
    DragDropModule, 
    QuillModule, 
    QuillEditorComponent,
    StyleEditorComponent
  ],
  templateUrl: './email-designer.component.html',
  styleUrls: ['./email-designer.component.css']
})
export class EmailDesignerComponent {
  contentBlocks: Array<{ 
    type: string; 
    data?: any;
    styles?: {
      padding?: number;
      backgroundColor?: string;
      color?: string;
      fontSize?: number;
      width?: number;
      textAlign?: string;
    }
  }> = [];
  showPreview = false;
  showStyleEditor = false;
  selectedBlock: any = null;

  constructor(private sanitizer: DomSanitizer) {}

  addBlock(type: string = 'text') {
    let block: any;
    switch (type) {
      case 'text':
        block = { 
          type: 'text', 
          data: '',
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            textAlign: 'left',
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'image':
        block = { 
          type: 'image', 
          data: '',
          styles: {
            padding: 16,
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'video':
        block = { 
          type: 'video', 
          data: '',
          styles: {
            padding: 16,
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'single-column':
        block = { 
          type: 'single-column', 
          data: [],
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'multi-column':
        block = { 
          type: 'multi-column', 
          data: [[], []],
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      default:
        block = { 
          type: 'text', 
          data: '',
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            textAlign: 'left',
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
    }
    this.contentBlocks.push(block);
  }

  onTextChange(index: number, value: string) {
    this.contentBlocks[index].data = value;
  }

  onImageChange(index: number, event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.contentBlocks[index].data = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoChange(index: number, event: any) {
    if (typeof event === 'string') {
      this.contentBlocks[index].data = event;
    } else if (event && event.target && typeof event.target.value === 'string') {
      this.contentBlocks[index].data = event.target.value;
    }
  }
  removeBlock(index: number, arr: any[] = this.contentBlocks) {
    if (arr === this.contentBlocks) {
      this.contentBlocks.splice(index, 1);
    } else {
      arr.splice(index, 1);
    }
  }

  moveBlockUp(index: number, arr: any[] = this.contentBlocks) {
    if (index > 0) {
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
    }
  }

  moveBlockDown(index: number, arr: any[] = this.contentBlocks) {
    if (index < arr.length - 1) {
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    if (!event || typeof event.previousIndex !== 'number' || typeof event.currentIndex !== 'number') {
      return;
    }

    // Get the container element to determine which list is being manipulated
    const container = event.container.element.nativeElement;
    
    if (container.classList.contains('nested-drop-list')) {
      // Handle nested block drops
      const parentElement = container.closest('[data-block-index]');
      if (parentElement) {        const blockIndex = parseInt(parentElement.getAttribute('data-block-index') ?? '-1');
        const columnIndex = parseInt(parentElement.getAttribute('data-column-index') ?? '-1');
        
        if (columnIndex >= 0) {
          // Multi-column nested blocks
          moveItemInArray(this.contentBlocks[blockIndex].data[columnIndex], event.previousIndex, event.currentIndex);
        } else {
          // Single-column nested blocks
          moveItemInArray(this.contentBlocks[blockIndex].data, event.previousIndex, event.currentIndex);
        }
      }
    } else {
      // Handle top-level blocks
      moveItemInArray(this.contentBlocks, event.previousIndex, event.currentIndex);
    }
  }

  addNestedBlock(parentIndex: number, colIndex?: number, type: string = 'text', subIdx?: number, subSubIdx?: number) {
    let block: any;
    switch (type) {
      case 'text':
        block = { 
          type: 'text', 
          data: '',
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            textAlign: 'left',
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'image':
        block = { 
          type: 'image', 
          data: '',
          styles: {
            padding: 16,
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'video':
        block = { 
          type: 'video', 
          data: '',
          styles: {
            padding: 16,
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'single-column':
        block = { 
          type: 'single-column', 
          data: [],
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      case 'multi-column':
        block = { 
          type: 'multi-column', 
          data: [[], []],
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
        break;
      default:
        block = { 
          type: 'text', 
          data: '',
          styles: {
            padding: 16,
            backgroundColor: '#ffffff',
            width: 100,
            textAlign: 'left',
            borderType: 'transparent',
            borderWidth: 1,
            borderColor: '#dee2e6',
            borderRadius: 0
          }
        };
    }

    // Deep nesting logic
    if (typeof subSubIdx === 'number' && typeof subIdx === 'number') {
      // 3rd level nesting (e.g., inside subsub of sub of parent)
      const sub = this.contentBlocks[parentIndex].data[subIdx];
      if (sub.type === 'single-column') {
        sub.data[subSubIdx].data = sub.data[subSubIdx].data || [];
        sub.data[subSubIdx].data.push(block);
      } else if (sub.type === 'multi-column' && typeof colIndex === 'number') {
        sub.data[subSubIdx] = sub.data[subSubIdx] || [];
        sub.data[subSubIdx][colIndex] = sub.data[subSubIdx][colIndex] || [];
        sub.data[subSubIdx][colIndex].push(block);
      }
    } else if (typeof subIdx === 'number') {
      // 2nd level nesting (e.g., inside sub of parent)
      const sub = this.contentBlocks[parentIndex].data[subIdx];
      if (sub.type === 'single-column') {
        if (!Array.isArray(sub.data)) {
          sub.data = [];
        }
        sub.data.push(block);
      } else if (sub.type === 'multi-column' && typeof colIndex === 'number') {
        if (!Array.isArray(sub.data)) {
          sub.data = [[], []];
        }
        if (!Array.isArray(sub.data[colIndex])) {
          sub.data[colIndex] = [];
        }
        sub.data[colIndex].push(block);
      }
    } else if (typeof colIndex === 'number') {
      // 1st level multi-column
      if (!Array.isArray(this.contentBlocks[parentIndex].data)) {
        this.contentBlocks[parentIndex].data = [[], []];
      }
      if (!Array.isArray(this.contentBlocks[parentIndex].data[colIndex])) {
        this.contentBlocks[parentIndex].data[colIndex] = [];
      }
      this.contentBlocks[parentIndex].data[colIndex].push(block);
    } else {
      // 1st level single-column
      if (!Array.isArray(this.contentBlocks[parentIndex].data)) {
        this.contentBlocks[parentIndex].data = [];
      }
      this.contentBlocks[parentIndex].data.push(block);
    }
  }
  moveNestedBlockUp(index: number, parentIndex: number, arr: any[]): void {
    if (index > 0) {
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
    }
  }

  moveNestedBlockDown(index: number, parentIndex: number, arr: any[]): void {
    if (index < arr.length - 1) {
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
    }
  }

  removeNestedBlock(index: number, parentIndex: number, arr: any[]): void {
    arr.splice(index, 1);
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  generatePreview(): string {
    let html = '';
    for (const block of this.contentBlocks) {
      html += this.generateBlockHtml(block);
    }
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
  selectBlock(block: any) {
    this.selectedBlock = block;
    this.showStyleEditor = true;
  }

  onStyleUpdate(event: {property: string, value: any}) {
    if (this.selectedBlock) {
      this.selectedBlock.styles[event.property] = event.value;
    }
  }

  closeStyleEditor() {
    this.showStyleEditor = false;
    this.selectedBlock = null;
  }

  getBlockStyles(block: any): string {
    if (!block.styles) return '';
    
    let styles = '';
    if (block.styles.padding) styles += `padding: ${block.styles.padding}px; `;
    if (block.styles.backgroundColor) styles += `background-color: ${block.styles.backgroundColor}; `;
    if (block.styles.width) styles += `width: ${block.styles.width}%; `;
    if (block.styles.textAlign) styles += `text-align: ${block.styles.textAlign}; `;

    // Handle border styles
    if (block.styles.borderType === 'light' || block.styles.borderType === 'solid') {
      if (block.styles.borderWidth) styles += `border-width: ${block.styles.borderWidth}px; `;
      if (block.styles.borderColor) styles += `border-color: ${block.styles.borderColor}; `;
      if (block.styles.borderRadius) styles += `border-radius: ${block.styles.borderRadius}px; `;
      styles += `border-style: ${block.styles.borderType === 'light' ? 'dashed' : 'solid'}; `;
    } else {
      styles += 'border: none; ';
    }

    return styles;
  }

  private generateBlockHtml(block: any, nested = false): string {
    let html = '';
    const styles = this.getBlockStyles(block);

    switch (block.type) {
      case 'text':
        html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="${styles}">${block.data || ''}</td>
          </tr>
        </table>`;
        break;
      case 'image':
        if (block.data) {
          html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="${styles}">
                <img src="${block.data}" alt="Image" style="max-width: 100%; display: block;">
              </td>
            </tr>
          </table>`;
        }
        break;
      case 'video':
        if (block.data) {
          html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="${styles}">
                <iframe src="${block.data}" width="100%" height="${nested ? '200' : '400'}" frameborder="0" allowfullscreen style="display: block;"></iframe>
              </td>
            </tr>
          </table>`;
        }
        break;
      case 'single-column':
        html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="${styles}">`;
        if (Array.isArray(block.data)) {
          html += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
          for (const nestedBlock of block.data) {
            html += '<tr><td>' + this.generateBlockHtml(nestedBlock, true) + '</td></tr>';
          }
          html += '</table>';
        }
        html += '</td></tr></table>';
        break;
      case 'multi-column':
        if (Array.isArray(block.data)) {
          const columnCount = block.data.length;
          const columnWidth = Math.floor(100 / columnCount);
          
          html += `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>`;
          
          for (const column of block.data) {
            html += `<td width="${columnWidth}%" style="${styles}">`;
            if (Array.isArray(column)) {
              html += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
              for (const nestedBlock of column) {
                html += '<tr><td>' + this.generateBlockHtml(nestedBlock, true) + '</td></tr>';
              }
              html += '</table>';
            }
            html += '</td>';
          }
          
          html += '</tr></table>';
        }
        break;
    }
    return html;
  }
}
