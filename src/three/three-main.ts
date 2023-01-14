import { tick3dSpace } from './xyz-space/xyz-space';
import { initGUI } from './gui/gui';

export function initThreeApp() {
    initGUI();

    tick();

    function tick() {
        requestAnimationFrame(tick);

        // レンダリング
        tick3dSpace();
    }
}
