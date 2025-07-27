import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptHistory } from './receipt-history';

describe('ReceiptHistory', () => {
  let component: ReceiptHistory;
  let fixture: ComponentFixture<ReceiptHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
