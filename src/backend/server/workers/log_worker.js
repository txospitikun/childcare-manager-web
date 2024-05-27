class logger
{
    static IS_ENABLED = true;

    static log(message)
    {
        if(!IS_ENABLED)
            return;

        console.log(message);
    }
}