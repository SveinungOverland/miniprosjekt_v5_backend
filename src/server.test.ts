import 'jest'

import { server, http, io } from './server'

test("[Is your server running]", done => {
    expect(server.length).toBe(3)
    done()
})

test("[http object]", done => {
    expect(http.eventNames()).toEqual([ 'connection', 'listening', 'close', 'upgrade', 'request' ])
    done()
})

test("[IO test]", done => {
    expect(io.origins()).toBe("*:*")
    done()
})