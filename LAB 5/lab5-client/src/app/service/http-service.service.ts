import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../model/tournament';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private httpClient: HttpClient) { }

  public getTournaments(query?: Object):Observable<Tournament[]>{
    return this.httpClient.get<Tournament[]>(`${baseUrl}/tournament`);
  }
}
