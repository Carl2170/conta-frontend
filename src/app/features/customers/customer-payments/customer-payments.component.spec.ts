import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentsComponent } from './customer-payments.component';

describe('CustomerPaymentsComponent', () => {
  let component: CustomerPaymentsComponent;
  let fixture: ComponentFixture<CustomerPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
