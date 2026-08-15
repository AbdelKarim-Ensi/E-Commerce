import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewsletter } from './admin-newsletter';

describe('AdminNewsletter', () => {
  let component: AdminNewsletter;
  let fixture: ComponentFixture<AdminNewsletter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewsletter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewsletter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
