import { filterOptions } from "@/config";
import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const Filter = () => {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => {
          return (
            <>
              <div key={keyItem}>
                <h3 className="text-base font-medium">{keyItem}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex items-center gap-2 font-normal"
                    >
                      <Checkbox id="" />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
