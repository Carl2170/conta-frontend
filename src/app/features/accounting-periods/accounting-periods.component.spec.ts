import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingPeriodsComponent } from './accounting-periods.component';

describe('AccountingPeriodsComponent', () => {
  let component: AccountingPeriodsComponent;
  let fixture: ComponentFixture<AccountingPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountingPeriodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountingPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
