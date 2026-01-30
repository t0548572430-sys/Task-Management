import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';

export interface Team {
  id: number;
  name: string;
  description?: string;
  owner_id?: number;
  members_count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/teams';

  getTeams() {
    return this.http.get<Team[]>(this.apiUrl);
  }

 createTeam(name: string) {
  // אנחנו שולחים רק שם, השרת בדרך כלל מצמיד את היוצר מה-Token באופן אוטומטי
  return this.http.post<Team>(this.apiUrl, { name });
}
  

addMemberToTeam(teamId: number, identifier: any) {
  // המרה למספר: אם זה "5" זה יהפוך ל-5. אם זה מייל, זה יישאר מייל.
  const parsedId = isNaN(Number(identifier)) ? identifier : Number(identifier);
  
  const payload = { 
    userId: parsedId 
  };

  console.log('Sending Payload:', payload); // תבדקי ב-F12 שזה מראה מספר בלי גרשיים
  
  return this.http.post(`${this.apiUrl}/${teamId}/members`, payload);
}
}