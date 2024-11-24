/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OverdueService } from './overdue.service';

describe('Service: Overdue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverdueService]
    });
  });

  it('should ...', inject([OverdueService], (service: OverdueService) => {
    expect(service).toBeTruthy();
  }));
});
