import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDesignerComponent } from './email-designer.component';

describe('EmailDesignerComponent', () => {
  let component: EmailDesignerComponent;
  let fixture: ComponentFixture<EmailDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailDesignerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
