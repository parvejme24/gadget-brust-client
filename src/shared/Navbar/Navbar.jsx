import React from "react";
import SearchIcon from "../icons/SearchIcon";
import {
  Dropdown,
  Link,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function Navbar() {
  return (
    <div className="container mx-auto">
      <h3>Logo</h3>

      <div className="flex items-center">
        <div className="">
          {/* <select name="Category" className="secondaryBG p-2">
            <option value="">All</option>
            <option value="">Laptop</option>
            <option value="">Laptop</option>
            <option value="">Laptop</option>
            <option value="">Laptop</option>
          </select> */}
          <Dropdown className="rounded-none" backdrop="blur">
            <DropdownTrigger>
              <Button variant="bordered">All</Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
              <DropdownItem key="new">New file</DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit file</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete file
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <input
            type="text"
            name="search"
            placeholder="Search by shop..."
            className="px-4 py-2 border"
          />
        </div>
        <SearchIcon className="w-10 p-2 secondaryBG" />
      </div>
    </div>
  );
}
