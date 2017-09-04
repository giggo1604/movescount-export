const saveMoveFactory = ({ fetch, fs, exportURL, createCookiesString }) =>
    async (move, config) => {
        const { MoveId: id } = move;
        const { format, folder, cookies } = config;

        const url = `${exportURL}id=${id}&format=${format}`;
        const cookiesString = createCookiesString(cookies);

        const result = await fetch(url, { headers: { Cookie: cookiesString } });
        await result.body.pipe(fs.createWriteStream(`${folder}move-${id}.${format}`));
    };

const fetchMovesFactory = ({ fetch, createURL }) =>
    async (baseURL, userId, authToken, startDate, endDate) => {
        const url = createURL(baseURL, 'moves/getmoves', {
            userId,
            startDateString: startDate.toISOString(),
            endDateString: endDate.toISOString(),
        });

        const result = await fetch(url, { headers: { Authorization: authToken } });
        const json = await result.json();
        const moves = json.Moves;

        return moves;
    };

export {
    fetchMovesFactory,
    saveMoveFactory,
};
