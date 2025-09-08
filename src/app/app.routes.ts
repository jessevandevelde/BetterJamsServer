import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./login-page/login-page.component";

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
            }
        ]
    }
];