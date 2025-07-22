import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAccountsComponent } from './accounting-accounts.component';

describe('AccountingAccountsComponent', () => {
  let component: AccountingAccountsComponent;
  let fixture: ComponentFixture<AccountingAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountingAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
