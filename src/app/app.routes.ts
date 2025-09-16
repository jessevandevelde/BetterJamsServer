import { Routes } from "@angular/router";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RoomPageComponent } from "./room-page/room-page.component";

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
            },
            {
                path:'room',
                component: RoomPageComponent,
            },
            {
                path:'',
                redirectTo:'room',
                pathMatch:'full',
      },
    ],
  },
];
