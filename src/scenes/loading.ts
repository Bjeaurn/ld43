import { Scene, Gine } from "gine";

export const LoadingScene: Scene = {
    count: 0,
    total: 0,
    x: 0,
    y: 0,
    parse(data: any[]) {
        this.total = data.length;
        data.forEach(d => {
            Gine.store.image(d.name, d.src);
            this.count++;
            if(this.count===this.total) {
                // this.destroy();
                console.log('done');
            }
        })
    },
    tick() {
        this.x++;
        this.y++;
    },
    frame() {
        Gine.handle.draw(Gine.store.get('coin'), this.x, this.y);
        Gine.handle.text('Bliep bloep', 20, 20);
    },
    second() {},
    destroy() {}
}