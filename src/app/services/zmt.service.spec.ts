import { TestBed, inject } from '@angular/core/testing';

import { ZmtService } from './zmt.service';

describe('ZmtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZmtService]
    });
  });

  it('should be created', inject([ZmtService], (service: ZmtService) => {
    expect(service).toBeTruthy();
  }));
});
