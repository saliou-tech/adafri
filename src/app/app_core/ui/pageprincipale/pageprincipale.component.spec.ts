import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageprincipaleComponent } from './pageprincipale.component';

describe('PageprincipaleComponent', () => {
  let component: PageprincipaleComponent;
  let fixture: ComponentFixture<PageprincipaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageprincipaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageprincipaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
