import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./login-page/login-page.component";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
            }
        ]
    }
];