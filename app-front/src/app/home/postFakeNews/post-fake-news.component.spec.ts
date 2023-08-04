import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFakeNewsComponent } from './post-fake-news.component';

describe('PostFakeNewsComponent', () => {
  let component: PostFakeNewsComponent;
  let fixture: ComponentFixture<PostFakeNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostFakeNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFakeNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
