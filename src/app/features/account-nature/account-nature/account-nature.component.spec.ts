import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNatureComponent } from './account-nature.component';

describe('AccountNatureComponent', () => {
  let component: AccountNatureComponent;
  let fixture: ComponentFixture<AccountNatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountNatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
