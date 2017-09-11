const saveMoveFactory = ({
    fetch,
    createWriteStream,
    createURL,
    createCookiesString,
    join,
    exportURL,
}) => async (move, config) => {
    const { MoveId: id } = move;
    const { format, folder, cookies } = config;

    const url = createURL(exportURL, null, { id, format });
    const cookiesString = createCookiesString(cookies);
    console.log(url, cookiesString);
    const result = await fetch(url, { headers: { Cookie: cookiesString } });
    await result.body.pipe(createWriteStream(join(folder, `move-${id}.${format}`)));
};

const fetchMovesFactory = ({ fetch, createURL }) =>
    async (baseURL, path, userId, authToken, startDate, endDate) => {
        const url = createURL(baseURL, path, {
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
