import { Injectable } from "@angular/core";
import { HttpService } from "../../../Shared/services/http/http.service";

@Injectable({
  providedIn: "root"
})
export class RubroService {
  route = "rubro";

  constructor(private httpService: HttpService) {}

  getRubros() {
    return this.httpService.get(this.route);
  }

  addRubro(data: any) {
    return this.httpService.post(this.route, data);
  }

  deleteRubro(id: string) {
    return this.httpService.delete(this.route + "/" + id);
  }
}
