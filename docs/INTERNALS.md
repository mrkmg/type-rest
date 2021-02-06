# Type Rest Internals

There are a set of special keys which can be used to get or set
information about the current route. Every Type Rest route has the
following properties:

**_root**: A reference to the root instance of this Type Rest route.

**_parent**: A reference to the parent instance of this route.

**_options**: See [Options](OPTIONS.md), this is writeable and where you
can override options for this route.

**_path**: This raw string of the current Type Rest route.

**_encodedPath**: The encoded path to this route.

**_fullPath**: An array of the paths to this route.

**_uri**: The full URL of this route.

**_resolvedOptions**: A readonly version of all the options which apply
to this route.

**_addHook**: See [Hooks](HOOKS.md). Used to add hooks to a route.
