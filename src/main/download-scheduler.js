import { queue } from 'async';

const downloadSchedulerFactory = ({ saveMove, updateMove, folder, cookies, limit }) =>
    queue(async ({ move, format }, cb) => {
        updateMove(move, { status: 'started' });
        await saveMove(move, { folder, format, cookies });
        updateMove(move, { status: 'done' });
        cb();
    }, limit);

export default downloadSchedulerFactory;
