import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) { }

    getAll(pageSize: number, pageIndex: number, searchText: string) {
        let params = new HttpParams().append('page', pageIndex + 1).append('pageSize', pageSize);
        if (searchText) params = params.append('search', searchText);
        return this.http.get<User>(environment.apiUrl + 'users', { params });
    }

    get(id: number) {
        return this.http.get<User>(environment.apiUrl + 'users/' + id);
    }

    add(data: User) {
        return this.http.post<User>(environment.apiUrl + 'users', data);
    }

    edit(data: User, id: number) {
        return this.http.put<User>(environment.apiUrl + 'users/' + id, data);
    }

    delete(id: number) {
        return this.http.delete<User>(environment.apiUrl + 'users/' + id);
    }
}