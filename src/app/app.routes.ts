import { Routes } from "@angular/router";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MediaPlayerComponent } from "./components/media-player/media-player.component";
import { QueueRowComponent } from "./components/queue-row/queue-row.component";

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
