import { TestBed } from '@angular/core/testing';

import { SocketserverService } from './socketserver.service';

describe('SocketserverService', () => {
  let service: SocketserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
