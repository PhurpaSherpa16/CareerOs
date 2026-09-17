export const Heading = ({label}: {label: string}) => {
    return(
        <div className="flex w-full items-center justify-between gap-8 tracking-wide text-(--secondaryBlack)">
            <h3 className="text-sm text-(--secondaryBlack)/60 tracking-wide">
                {label}
            </h3>
            <hr className="flex-1 text-(--secondaryBlack)/20" />
        </div>
    )
}