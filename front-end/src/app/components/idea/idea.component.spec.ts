import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaComponent } from './idea.component';

describe('IdeaComponent', () => {
  let component: IdeaComponent;
  let fixture: ComponentFixture<IdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
