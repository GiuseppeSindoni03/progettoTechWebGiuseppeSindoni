import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaPageComponent } from './idea-page.component';

describe('IdeaPageComponent', () => {
  let component: IdeaPageComponent;
  let fixture: ComponentFixture<IdeaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
