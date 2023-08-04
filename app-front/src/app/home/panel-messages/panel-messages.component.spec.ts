import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMessagesComponent } from './panel-messages.component';

describe('PanelMessagesComponent', () => {
  let component: PanelMessagesComponent;
  let fixture: ComponentFixture<PanelMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
