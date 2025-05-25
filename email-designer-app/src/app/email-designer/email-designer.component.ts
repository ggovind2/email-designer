import { Component, SecurityContext } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { SafeUrlPipe } from './safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';
import { StyleEditorComponent } from './style-editor/style-editor.component';
import { Block, TextBlock, ImageBlock, VideoBlock, SingleColumnBlock, MultiColumnBlock } from './models/block.interface';
import { BlockType } from './models/block-type.enum';
import { BlockStyle } from './models/block-style.interface';

interface BlockMenuItem {
  label: string;
  type: BlockType;
  icon?: string;
}

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
  readonly mainBlockMenuItems: BlockMenuItem[] = [
    { label: 'Add Text', type: BlockType.Text, icon: 'fa-font' },
    { label: 'Add Image', type: BlockType.Image, icon: 'fa-image' },
    { label: 'Add Video', type: BlockType.Video, icon: 'fa-video' },
    { label: 'Add Single Column', type: BlockType.SingleColumn, icon: 'fa-square' },
    { label: 'Add Multi Column', type: BlockType.MultiColumn, icon: 'fa-columns' }
  ];  readonly nestedBlockMenuItems: BlockMenuItem[] = [
    { label: 'Add Text', type: BlockType.Text, icon: 'fa-font' },
    { label: 'Add Image', type: BlockType.Image, icon: 'fa-image' },
    { label: 'Add Video', type: BlockType.Video, icon: 'fa-video' },
    { label: 'Add Single Column', type: BlockType.SingleColumn, icon: 'fa-square' },
    { label: 'Add Multi Column', type: BlockType.MultiColumn, icon: 'fa-columns' },
  ];

  contentBlocks: Block[] = [];
  showPreview = false;
  showStyleEditor = false;
  selectedBlock: Block | null = null;
  BlockType = BlockType; // Make enum available to template

  constructor(private sanitizer: DomSanitizer) {}

  private createDefaultStyles(): BlockStyle {
    return {
      padding: 16,
      backgroundColor: '#ffffff',
      width: 100,
      textAlign: 'left',
      borderType: 'transparent',
      borderWidth: 1,
      borderColor: '#dee2e6',
      borderRadius: 0
    };
  }

  private createBlock(type: BlockType): Block {
    const defaultStyles = this.createDefaultStyles();

    switch (type) {
      case BlockType.Text:
        return {
          type,
          data: '',
          styles: { ...defaultStyles }
        } as TextBlock;
      case BlockType.Image:
        return {
          type,
          data: '',
          styles: { ...defaultStyles }
        } as ImageBlock;
      case BlockType.Video:
        return {
          type,
          data: '',
          styles: { ...defaultStyles }
        } as VideoBlock;
      case BlockType.SingleColumn:
        return {
          type,
          data: [],
          styles: { ...defaultStyles }
        } as SingleColumnBlock;
      case BlockType.MultiColumn:
        return {
          type,
          data: [[], []],
          styles: { ...defaultStyles }
        } as MultiColumnBlock;
      default:
        return this.createBlock(BlockType.Text);
    }
  }

  addBlock(type: BlockType = BlockType.Text): Block {
    const block = this.createBlock(type);
    this.contentBlocks.push(block);
    return block;
  }

  onTextChange(index: number, value: string): void {
    const block = this.contentBlocks[index];
    if (block?.type === BlockType.Text) {
      (block as TextBlock).data = value;
    }
  }


  onVideoChange(index: number, event: string | { target: { value: string } }): void {
    const block = this.contentBlocks[index];
    if (block?.type === BlockType.Video) {
      if (typeof event === 'string') {
        (block as VideoBlock).data = event;
      } else if (event?.target?.value) {
        (block as VideoBlock).data = event.target.value;
      }
    }
  }

  removeBlock(index: number, blocks: Block[] = this.contentBlocks): void {
    blocks.splice(index, 1);
  }

  moveBlockUp(index: number, blocks: Block[] = this.contentBlocks): void {
    if (index > 0) {
      const temp = blocks[index];
      blocks[index] = blocks[index - 1];
      blocks[index - 1] = temp;
    }
  }

  moveBlockDown(index: number, blocks: Block[] = this.contentBlocks): void {
    if (index < blocks.length - 1) {
      const temp = blocks[index];
      blocks[index] = blocks[index + 1];
      blocks[index + 1] = temp;
    }
  }

  drop(event: CdkDragDrop<Block[]>): void {
    if (!event || typeof event.previousIndex !== 'number' || typeof event.currentIndex !== 'number') {
      return;
    }

    const container = event.container.element.nativeElement;
    if (container.classList.contains('nested-drop-list')) {
      const parentElement = container.closest('[data-block-index]');
      if (parentElement) {
        const blockIndex = parseInt(parentElement.getAttribute('data-block-index') ?? '-1');
        const columnIndex = parseInt(parentElement.getAttribute('data-column-index') ?? '-1');
        
        if (blockIndex !== -1) {
          const parentBlock = this.contentBlocks[blockIndex];
          if (columnIndex >= 0 && parentBlock.type === BlockType.MultiColumn) {
            const multiColumnBlock = parentBlock as MultiColumnBlock;
            moveItemInArray(multiColumnBlock.data[columnIndex], event.previousIndex, event.currentIndex);
          } else if (parentBlock.type === BlockType.SingleColumn) {
            const singleColumnBlock = parentBlock as SingleColumnBlock;
            moveItemInArray(singleColumnBlock.data, event.previousIndex, event.currentIndex);
          }
        }
      }
    } else {
      moveItemInArray(this.contentBlocks, event.previousIndex, event.currentIndex);
    }
  }

  dropNested(event: CdkDragDrop<Block[]>, parentBlock: Block, colIndex?: number): void {
    if (!event || typeof event.previousIndex !== 'number' || typeof event.currentIndex !== 'number') {
      return;
    }

    if (colIndex !== undefined && parentBlock.type === BlockType.MultiColumn) {
      const multiColumnBlock = parentBlock as MultiColumnBlock;
      moveItemInArray(multiColumnBlock.data[colIndex], event.previousIndex, event.currentIndex);
    } else if (parentBlock.type === BlockType.SingleColumn) {
      const singleColumnBlock = parentBlock as SingleColumnBlock;
      moveItemInArray(singleColumnBlock.data, event.previousIndex, event.currentIndex);
    }
  }

  dropNestedMultiColumn(event: CdkDragDrop<Block[]>, block: MultiColumnBlock, columnIndex: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  deleteNestedBlockFromColumn(block: MultiColumnBlock, columnIndex: number, blockIndex: number, event: Event) {
    event.stopPropagation();
    if (block.data[columnIndex]) {
      const column = block.data[columnIndex] as Block[];
      column.splice(blockIndex, 1);
    }
  }

  onNestedMultiColumnTextChange(block: MultiColumnBlock, columnIndex: number, blockIndex: number, value: string) {
    if (block.data[columnIndex][blockIndex].type === BlockType.Text) {
      (block.data[columnIndex][blockIndex] as TextBlock).data = value;
    }
  }


  onNestedMultiColumnVideoChange(block: MultiColumnBlock, columnIndex: number, blockIndex: number, value: string) {
    if (block.data[columnIndex][blockIndex].type === BlockType.Video) {
      (block.data[columnIndex][blockIndex] as VideoBlock).data = value;
    }
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  generatePreview(): string {
    let html = '';
    for (const block of this.contentBlocks) {
      html += this.generateBlockHtml(block);
    }
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }

  selectBlock(block: Block, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedBlock = block;
    this.showStyleEditor = true;
  }

  showStyleEditorForBlock(block: Block, event: Event): void {
    event.stopPropagation(); // Prevent click from bubbling
    this.selectedBlock = block;
    this.showStyleEditor = true;
  }

  onStyleUpdate(event: { property: keyof BlockStyle; value: any }): void {
    if (this.selectedBlock?.styles) {
      this.selectedBlock.styles[event.property] = event.value;
    }
  }

  closeStyleEditor(): void {
    this.showStyleEditor = false;
    this.selectedBlock = null;
  }

  // Removed duplicate getBlockStyles(block: Block): string method to resolve duplicate implementation error.

  private generateBlockHtml(block: Block, nested: boolean = false): string {
    const styles = this.getBlockStyles(block);
    let html = '';

    switch (block.type) {
      case BlockType.Text: {
        const textBlock = block as TextBlock;
        html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="${styles}">${textBlock.data || ''}</td>
          </tr>
        </table>`;
        break;
      }
      case BlockType.Image: {
        const imageBlock = block as ImageBlock;
        if (imageBlock.data) {
          html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="${styles}">
                <img src="${imageBlock.data}" alt="Image" style="max-width: 100%; display: block;">
              </td>
            </tr>
          </table>`;
        }
        break;
      }
      case BlockType.Video: {
        const videoBlock = block as VideoBlock;
        if (videoBlock.data) {
          html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="${styles}">
                <iframe src="${videoBlock.data}" width="100%" height="${nested ? '200' : '400'}" frameborder="0" allowfullscreen style="display: block;"></iframe>
              </td>
            </tr>
          </table>`;
        }
        break;
      }
      case BlockType.SingleColumn: {
        const singleColumnBlock = block as SingleColumnBlock;
        html += `<table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="${styles}">`;
        if (singleColumnBlock.data.length > 0) {
          html += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
          for (const nestedBlock of singleColumnBlock.data) {
            html += '<tr><td>' + this.generateBlockHtml(nestedBlock, true) + '</td></tr>';
          }
          html += '</table>';
        }
        html += '</td></tr></table>';
        break;
      }
      case BlockType.MultiColumn: {
        const multiColumnBlock = block as MultiColumnBlock;
        if (multiColumnBlock.data.length > 0) {
          const columnCount = multiColumnBlock.data.length;
          const columnWidth = Math.floor(100 / columnCount);
          
          html += `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>`;
          
          for (const column of multiColumnBlock.data) {
            html += `<td width="${columnWidth}%" style="${styles}">`;
            if (column.length > 0) {
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
    }
    return html;
  }

  deleteNestedBlock(block: SingleColumnBlock, blockIndex: number, event: Event) {
    event.stopPropagation();
    block.data.splice(blockIndex, 1);
  }

  onNestedTextChange(block: SingleColumnBlock, blockIndex: number, value: string) {
    if (block.data[blockIndex].type === BlockType.Text) {
      (block.data[blockIndex] as TextBlock).data = value;
    }
  }

  onNestedVideoChange(block: SingleColumnBlock, blockIndex: number, value: string) {
    if (block.data[blockIndex].type === BlockType.Video) {
      (block.data[blockIndex] as VideoBlock).data = value;
    }
  }  addNestedBlock(block: SingleColumnBlock, type: BlockType) {
    const newBlock = this.createBlock(type);
    block.data.push(newBlock);
  }

  addNestedBlockToSingleColumn(block: SingleColumnBlock, type: BlockType) {
    if (type === BlockType.SingleColumn || type === BlockType.MultiColumn) {
      const newBlock = this.createBlock(type);
      block.data.push(newBlock);
    }
  }

  addNestedBlockToColumn(block: MultiColumnBlock, columnIndex: number, type: BlockType) {
    const newBlock = this.createBlock(type);
    if (!block.data[columnIndex]) {
      block.data[columnIndex] = [] as Block[];
    }
    const column = block.data[columnIndex] as Block[];
    column.push(newBlock);
  }

  getBlockStyles(block: Block): string {
    const styles = {
      padding: (block.styles?.padding ?? 16) + 'px',
      backgroundColor: block.styles?.backgroundColor ?? '#ffffff',
      width: (block.styles?.width ?? 100) + '%',
      textAlign: block.styles?.textAlign ?? 'left',
      border: block.styles?.borderType === 'transparent' ? 'none' :
        `${block.styles?.borderWidth ?? 1}px ${block.styles?.borderType ?? 'solid'} ${block.styles?.borderColor ?? '#dee2e6'}`,
      borderRadius: (block.styles?.borderRadius ?? 0) + 'px'
    };

    // Convert styles object to CSS string
    return Object.entries(styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');
  }

  // Helper method to handle file input safely
  private handleFileInput(files: FileList | null, callback: (result: string) => void) {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        callback(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  }

  onImageChange(blockIndex: number, event: { target: { files: FileList | null } }) {
    this.handleFileInput(event.target.files, (result) => {
      if (this.contentBlocks[blockIndex].type === BlockType.Image) {
        (this.contentBlocks[blockIndex] as ImageBlock).data = result;
      }
    });
  }

  onNestedImageChange(block: SingleColumnBlock, blockIndex: number, event: { target: { files: FileList | null } }) {
    this.handleFileInput(event.target.files, (result) => {
      if (block.data[blockIndex].type === BlockType.Image) {
        (block.data[blockIndex] as ImageBlock).data = result;
      }
    });
  }

  onNestedMultiColumnImageChange(block: MultiColumnBlock, columnIndex: number, blockIndex: number, event: { target: { files: FileList | null } }) {
    this.handleFileInput(event.target.files, (result) => {
      if (block.data[columnIndex][blockIndex].type === BlockType.Image) {
        (block.data[columnIndex][blockIndex] as ImageBlock).data = result;
      }
    });
  }

  onNestedMultiColumnSubBlockTextChange(block: any, nestingIndex: number, columnIndex: number, value: string) {
    if (block.data[nestingIndex][columnIndex].type === BlockType.Text) {
      (block.data[nestingIndex][columnIndex] as TextBlock).data = value;
    }
  }

  onNestedMultiColumnSubBlockVideoChange(block: any, nestingIndex: number, columnIndex: number, value: string) {
    if (block.data[nestingIndex][columnIndex].type === BlockType.Video) {
      (block.data[nestingIndex][columnIndex] as VideoBlock).data = value;
    }
  }
  onNestedMultiColumnSubBlockImageChange(block: any, nestingIndex: number, columnIndex: number, event: { target: { files: FileList | null } }) {
   if (block.data[nestingIndex][columnIndex].type === BlockType.Image) {
      this.handleFileInput(event.target.files, (result) => {
       (block.data[nestingIndex][columnIndex] as ImageBlock).data = result;
      });
    }
  }

  deleteNestedMultiColumnSubBlock(block: MultiColumnBlock, targetColumnIndex: number, blockIndexInColumn: number, event: Event) {
  event.stopPropagation();

  if (block.data[targetColumnIndex] && Array.isArray(block.data[targetColumnIndex])) {
    const column: Block[] = block.data[targetColumnIndex]; // Now 'column' is correctly inferred as Block[]

    if (blockIndexInColumn >= 0 && blockIndexInColumn < column.length) {
      column.splice(blockIndexInColumn, 1); // Delete 1 element at blockIndexInColumn
    } else {
      console.warn(`Attempted to delete block at invalid index ${blockIndexInColumn} in column ${targetColumnIndex}. Column length: ${column.length}`);
    }
  } else {
    console.warn(`Attempted to delete from non-existent or invalid column at index ${targetColumnIndex}.`);
  }
}

 addNestedMultiColumnSubBlock(block: MultiColumnBlock, targetColumnIndex: number, insertAtIndex: number, type: BlockType) {
  const newBlock = this.createBlock(type);
 
  if (!block.data[targetColumnIndex]) {
    block.data[targetColumnIndex] = []; // This initializes a new column as Block[]
  }

  const column: Block[] = block.data[targetColumnIndex];

  column.splice(insertAtIndex, 0, newBlock);

}

  // Single Column nested block changes
  onNestedSingleColumnSubBlockTextChange(parentBlock: SingleColumnBlock, blockIndex: number, subBlockIndex: number, value: string) {
    if (parentBlock.data[blockIndex].type === BlockType.SingleColumn) {
      const singleColumnBlock = parentBlock.data[blockIndex] as SingleColumnBlock;
      if (singleColumnBlock.data[subBlockIndex].type === BlockType.Text) {
        (singleColumnBlock.data[subBlockIndex] as TextBlock).data = value;
      }
    }
  }

  onNestedSingleColumnSubBlockVideoChange(parentBlock: SingleColumnBlock, blockIndex: number, subBlockIndex: number, value: string) {
    if (parentBlock.data[blockIndex].type === BlockType.SingleColumn) {
      const singleColumnBlock = parentBlock.data[blockIndex] as SingleColumnBlock;
      if (singleColumnBlock.data[subBlockIndex].type === BlockType.Video) {
        (singleColumnBlock.data[subBlockIndex] as VideoBlock).data = value;
      }
    }
  }

  onNestedSingleColumnSubBlockImageChange(parentBlock: SingleColumnBlock, blockIndex: number, subBlockIndex: number, event: { target: { files: FileList | null } }) {
    if (parentBlock.data[blockIndex].type === BlockType.SingleColumn) {
      const singleColumnBlock = parentBlock.data[blockIndex] as SingleColumnBlock;
      this.handleFileInput(event.target.files, (result) => {
        if (singleColumnBlock.data[subBlockIndex].type === BlockType.Image) {
          (singleColumnBlock.data[subBlockIndex] as ImageBlock).data = result;
        }
      });
    }
  }


  // Helper methods for nested block manipulation
  deleteNestedSingleColumnSubBlock(parentBlock: SingleColumnBlock, blockIndex: number, subBlockIndex: number, event: Event) {
    event.stopPropagation();
    if (parentBlock.data[blockIndex].type === BlockType.SingleColumn) {
      const singleColumnBlock = parentBlock.data[blockIndex] as SingleColumnBlock;
      singleColumnBlock.data.splice(subBlockIndex, 1);
    }
  }

  addNestedSingleColumnSubBlock(parentBlock: SingleColumnBlock, blockIndex: number, type: BlockType) {
    if (parentBlock.data[blockIndex].type === BlockType.SingleColumn) {
      const singleColumnBlock = parentBlock.data[blockIndex] as SingleColumnBlock;
      const newBlock = this.createBlock(type);
      singleColumnBlock.data.push(newBlock);
    }
  }
  
}
