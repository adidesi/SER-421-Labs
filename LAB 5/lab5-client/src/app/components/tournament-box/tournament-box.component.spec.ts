import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentBoxComponent } from './tournament-box.component';

describe('TournamentBoxComponent', () => {
  let component: TournamentBoxComponent;
  let fixture: ComponentFixture<TournamentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
